import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import registrationSchema from '../validation/registrationSchema';
import axios from 'axios';
import '../css/style.css';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [formErrors, setFormErrors] = useState({});
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const validateForm = async () => {
        try {
            await registrationSchema.validate(formData, { abortEarly: false });
            return true; 
        } catch (error) {
            const errors = {};
            error.inner.forEach(err => {
                errors[err.path] = err.message;
            });
            setFormErrors(errors);
            return false;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        setFormData({
            ...formData,
            [name]: value,
        });
        if (name === 'password' || name === 'confirmPassword') {
            setPasswordsMatch(formData.password === value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = await validateForm();

        if (!isValid) {
            return;
        }

        try {
            const response = await axios.post('https://blog-spots-service.onrender.com/api/register', formData);
            console.log('Server response:', response.data);
            alert('Registration successful!');
        } catch (error) {
            console.error('Error submitting registration form:', error);
            if (error.response) {
                alert(`Registration failed: ${error.response.data.message}`);
            } else if (error.request) {
                alert('No response received from the server. Please check your internet connection.');
            } else {
                alert('An unexpected error occurred. Please try again later.');
            }
        }
    };

    return (
        <div>
            <div className="top-bar">
                <div className="top-bar-content">
                    <h1>MingleMingle</h1>
                </div>
            </div>

            <div className="register-container">
                <h1 className="register-header">Register</h1>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label>First Name:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        {formErrors.firstName && <p className="error-text">{formErrors.firstName}</p>}
                    </div>
                    <div className="form-group">
                        <label>Middle Name:</label>
                        <input
                            type="text"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                        {formErrors.lastName && <p className="error-text">{formErrors.lastName}</p>}
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {formErrors.email && <p className="error-text">{formErrors.email}</p>}
                    </div>
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        {formErrors.username && <p className="error-text">{formErrors.username}</p>}
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {formErrors.password && <p className="error-text">{formErrors.password}</p>}
                    </div>
                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        {!passwordsMatch && <p className="error-text">{formErrors.confirmPassword}</p>}
                    </div>
                    <button type="submit" className="register-button">
                        Register
                    </button>
                </form>
                <p className="link-login">
                    Already registered? <Link to="/login">Log in here</Link>.
                </p>
            </div>
        </div>
    );
};

export default Register;

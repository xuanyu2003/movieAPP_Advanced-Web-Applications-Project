import React, { useState } from 'react';
import "./ResetPassword.css"; 
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
    const [users_email, setUsersEmail] = useState('');
    const [users_id, setUsersId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const url = process.env.REACT_APP_API_URL;

    const resetPassword = async (e) => {
        e.preventDefault();
        if (!users_email || !users_id || !password || !confirmPassword) {
            alert('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post(url + '/user/resetpassword', {
                users_email,
                users_id,
                new_password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.message) {
                setMessage(response.data.message);
                // Redirect to login or home page after successful password reset
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (error) {
            console.log('Error while resetting password: ', error);
            if (error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error); // Display error message from the server
            } else {
                alert('An error occurred while resetting the password');
            }
        }
    };

    return (
        <div className="Container">
            <div className="app-container">
            <div className="app-title">
            <h1>Reset Password</h1>
            </div>

            {message && <p className="message">{message}</p>}
            <form className="Form" onSubmit={resetPassword}>
                <label className='Label'>User Email</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={users_email}
                    onChange={(e) => setUsersEmail(e.target.value)}
                    className="form-input"
                    required
                />

                <label className='Label'>User ID</label>
                <input
                    type="text"
                    placeholder="Enter your user ID"
                    value={users_id}
                    onChange={(e) => setUsersId(e.target.value)}
                    className="form-input"
                    required
                />

                <label className='Label'>New Password</label>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className='form-input'
                />

                <label className='Label'>Confirm New Password</label>
                <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className='form-input'
                />

                <button type="submit" className="btn">
                    Reset Password
                </button>
            </form>
            <p className="remember-password">
                    Remember your password? <Link to="/login" className="login-link">Login here</Link>
                </p>

            </div>
        </div>
    );
}

export default ResetPassword;

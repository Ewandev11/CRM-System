import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; 

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError("");
        try {
            // Calls http://127.0.0.1:8000/api/v1/auth/login/
            const res = await api.post('/auth/login/', {
                username: credentials.username,
                password: credentials.password
            });

            const token = res.data.access || res.data.token;
            const userData = res.data.user || { username: credentials.username };

            login(userData, token);
            navigate('/dashboard');
        } catch (error) {
            setLoginError("Invalid username or password");
            console.error("Login Error:", error);
            
            // Debugging: Log the full error to see if it's CORS or 404
            if (error.response) {
                console.log("Response Data:", error.response.data);
                console.log("Status:", error.response.status);
            } else if (error.request) {
                console.log("No response received (Network/CORS issue):", error.request);
            }
        }
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={{ color: '#fff', marginBottom: '30px' }}>CRM Login</h2>
                {loginError && <div style={errorStyle}>{loginError}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input 
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={credentials.username}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />
                    <input 
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />
                    <button type="submit" style={buttonStyle}>Log In</button>
                </form>
            </div>
        </div>
    );
};

// Styles
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212' };
const cardStyle = { padding: '40px', borderRadius: '12px', backgroundColor: '#1e1e1e', width: '100%', maxWidth: '400px', textAlign: 'center', border: '1px solid #333' };
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#2d2d2d', color: '#fff' };
const buttonStyle = { padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#007bff', color: '#fff', fontWeight: 'bold', cursor: 'pointer' };
const errorStyle = { color: '#ff4d4d', marginBottom: '15px', fontSize: '14px' };

export default LoginPage;
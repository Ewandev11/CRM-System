import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(credentials.username, credentials.password);
            navigate('/dashboard'); // Go to dashboard on success
        } catch (error) {
            alert("Login Failed: Check your credentials or Backend connection");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
            <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                <h2>CRM Login</h2>
                <div style={{ marginBottom: '10px' }}>
                    <input 
                        name="username" 
                        placeholder="Username" 
                        onChange={handleChange} 
                        style={{ width: '100%', padding: '8px' }}
                        required 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input 
                        name="password" 
                        type="password" 
                        placeholder="Password" 
                        onChange={handleChange} 
                        style={{ width: '100%', padding: '8px' }}
                        required 
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
                    Log In
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
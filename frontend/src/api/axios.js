import axios from 'axios';

const api = axios.create({
    // Ensure this matches your Django server address
    baseURL: 'http://127.0.0.1:8000/api/v1/', 
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Matches what AuthContext saves
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';


import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import Contacts from './pages/Contacts'; 
import ActivityLogPage from './pages/ActivityLogPage';

const Navbar = () => {
    const { logout } = useContext(AuthContext);
    return (
        <nav style={{ padding: '1rem', background: '#333', color: '#fff', display: 'flex', gap: '15px' }}>
            <Link to="/dashboard" style={{ color: '#fff' }}>Dashboard</Link>
            <Link to="/companies" style={{ color: '#fff' }}>Companies</Link>
            <Link to="/activity-logs" style={{ color: '#fff' }}>Logs</Link>
            <button onClick={logout} style={{ marginLeft: 'auto' }}>Logout</button>
        </nav>
    );
};

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div style={{ padding: '20px' }}>Loading session...</div>;
    
    if (!user) return <Navigate to="/login" />;

    return (
        <>
            <Navbar />
            {children}
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
                    <Route path="/companies/:id" element={<ProtectedRoute><CompanyDetail /></ProtectedRoute>} />
                    <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
                    <Route path="/activity-logs" element={<ProtectedRoute><ActivityLogPage /></ProtectedRoute>} />

                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
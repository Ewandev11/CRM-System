import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ 
            background: '#2c3e50', padding: '1rem 2rem', 
            display: 'flex', alignItems: 'center', color: 'white', marginBottom: '20px'
        }}>
            <h3 style={{ margin: 0, marginRight: '40px' }}>
                CRM | {user?.organization_name || "Enterprise"}
            </h3>
            <div style={{ display: 'flex', gap: '20px' }}>
                <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
                <Link to="/companies" style={{ color: 'white', textDecoration: 'none' }}>Companies</Link>
                <Link to="/contacts" style={{ color: 'white', textDecoration: 'none' }}>Contacts</Link>
                <Link to="/activity-logs" style={{ color: 'white', textDecoration: 'none' }}>Activity Log</Link>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Role: {user?.role}</span>
                <button 
                    onClick={handleLogout} 
                    style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
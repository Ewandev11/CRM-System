import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({ companies: 0, contacts: 0 });

    const fetchDashboardData = async () => {
        try {
            // Fetch logs and basic counts
            const [logRes, compRes, contRes] = await Promise.all([
                api.get('/crm/logs/'), // We'll add this endpoint next
                api.get('/crm/companies/'),
                api.get('/crm/contacts/')
            ]);
            setLogs(logRes.data);
            setStats({
                companies: compRes.data.length,
                contacts: contRes.data.length
            });
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchDashboardData(); }, []);

    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1>Dashboard</h1>
                
                {/* Stats Cards */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                    <div style={cardStyle}><h3>Companies</h3><p size="24px">{stats.companies}</p></div>
                    <div style={cardStyle}><h3>Contacts</h3><p>{stats.contacts}</p></div>
                </div>

                {/* Activity Feed */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                    <h2>Recent Activity</h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {logs.map(log => (
                            <li key={log.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                                <strong>{log.user_email}</strong> {log.action} <strong>{log.target}</strong>
                                <br />
                                <small style={{ color: '#888' }}>{new Date(log.timestamp).toLocaleString()}</small>
                            </li>
                        ))}
                        {logs.length === 0 && <p>No recent activity found.</p>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const cardStyle = {
    flex: 1,
    padding: '20px',
    background: '#3498db',
    color: 'white',
    borderRadius: '8px',
    textAlign: 'center'
};

export default Dashboard;
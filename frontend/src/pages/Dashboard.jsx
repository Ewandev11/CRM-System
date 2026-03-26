import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({ companies: 0, contacts: 0 });
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [logRes, compRes, contRes] = await Promise.all([
                api.get('/activity-logs/'), 
                api.get('/companies/'),
                api.get('/contacts/')
            ]);
            
            setLogs(logRes.data.results ? logRes.data.results.slice(0, 5) : (logRes.data || []).slice(0, 5));
            
            setStats({
                companies: compRes.data.count !== undefined ? compRes.data.count : (compRes.data.length || 0),
                contacts: contRes.data.count !== undefined ? contRes.data.count : (contRes.data.length || 0)
            });
        } catch (err) { 
            console.error("Dashboard fetch error:", err); 
            if (err.response?.status === 404) {
                console.log("One of the endpoints does not exist. Check your backend URLs.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchDashboardData(); 
    }, []);

    // Helper to color-code activity types
    const getActionColor = (action) => {
        if (action?.includes('CREATE')) return '#27ae60';
        if (action?.includes('DELETE')) return '#e74c3c';
        return '#f39c12'; 
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Navbar />
            
            <main style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto' }}>
                <header style={{ marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '28px', color: '#2c3e50', margin: 0 }}>Organization Overview</h1>
                    <p style={{ color: '#7f8c8d', marginTop: '5px' }}>Real-time CRM insights and activity.</p>
                </header>
                
                {/* Stats Grid */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                    gap: '25px', 
                    marginBottom: '40px' 
                }}>
                    <div style={cardStyle}>
                        <span style={labelStyle}>Total Companies</span>
                        <div style={statNumberStyle}>{stats.companies}</div>
                        <div style={{...indicatorStyle, backgroundColor: '#3498db'}} />
                    </div>
                    
                    <div style={cardStyle}>
                        <span style={labelStyle}>Active Contacts</span>
                        <div style={statNumberStyle}>{stats.contacts}</div>
                        <div style={{...indicatorStyle, backgroundColor: '#9b59b6'}} />
                    </div>
                </div>

                {/* Activity Feed Container */}
                <div style={feedContainerStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '20px', margin: 0, color: '#2c3e50' }}>Recent Activity</h2>
                        <button onClick={fetchDashboardData} style={refreshBtnStyle}>Refresh</button>
                    </div>

                    {loading ? (
                        <p style={{ textAlign: 'center', color: '#95a5a6' }}>Updating feed...</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {logs.length > 0 ? logs.map(log => (
                                <div key={log.id} style={logItemStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ 
                                            width: '10px', height: '10px', borderRadius: '50%', 
                                            backgroundColor: getActionColor(log.action_type) 
                                        }} />
                                        <div>
                                            <span style={{ fontWeight: '600', color: '#34495e' }}>{log.user_email || 'User'}</span>
                                            <span style={{ color: '#7f8c8d' }}> {log.action_type?.toLowerCase()}d </span>
                                            <span style={{ fontWeight: '500' }}>{log.model_name}: {log.object_repr || log.object_id}</span>
                                        </div>
                                    </div>
                                    <small style={{ color: '#bdc3c7' }}>{new Date(log.timestamp).toLocaleString()}</small>
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#bdc3c7' }}>
                                    No recent activity recorded.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

const cardStyle = {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid #edf2f7'
};

const labelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

const statNumberStyle = {
    fontSize: '36px',
    fontWeight: '700',
    color: '#1e293b',
    marginTop: '10px'
};

const indicatorStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '4px'
};

const feedContainerStyle = {
    background: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
    border: '1px solid #edf2f7'
};

const logItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #f1f5f9',
    transition: 'transform 0.2s ease',
    cursor: 'default'
};

const refreshBtnStyle = {
    padding: '6px 12px',
    fontSize: '13px',
    backgroundColor: 'transparent',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#64748b'
};

export default Dashboard;
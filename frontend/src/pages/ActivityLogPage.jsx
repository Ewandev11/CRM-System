import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const ActivityLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get('/activity-logs/');
                setLogs(res.data.results || res.data);
            } catch (err) { 
                console.error("Failed to fetch logs:", err); 
            }
            finally { setLoading(false); }
        };
        fetchLogs();
    }, []);

    const getBadgeStyle = (action) => {
        const base = { padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' };
        if (action?.includes('CREATE')) return { ...base, backgroundColor: '#dcfce7', color: '#166534' };
        if (action?.includes('DELETE')) return { ...base, backgroundColor: '#fee2e2', color: '#991b1b' };
        return { ...base, backgroundColor: '#fef9c3', color: '#854d0e' }; // Update
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
                <header style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '24px', color: '#2c3e50', margin: 0 }}>System Audit Trail</h2>
                    <p style={{ color: '#64748b' }}>A complete record of all organizational changes.</p>
                </header>

                <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #edf2f7', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={logTh}>User</th>
                                <th style={logTh}>Action</th>
                                <th style={logTh}>Resource</th>
                                <th style={logTh}>Date & Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>Syncing logs...</td></tr>
                            ) : logs.length > 0 ? (
                                logs.map(log => (
                                    <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={logTd}>
                                            <div style={{ fontWeight: '600' }}>{log.user_email}</div>
                                        </td>
                                        <td style={logTd}>
                                            <span style={getBadgeStyle(log.action_type || log.action)}>
                                                {log.action_type || log.action}
                                            </span>
                                        </td>
                                        <td style={logTd}>
                                            <span style={{ color: '#64748b' }}>{log.model_name}</span>
                                            <span style={{ margin: '0 5px' }}>•</span>
                                            <span>ID: {log.target || log.object_id}</span>
                                        </td>
                                        <td style={logTd}>{new Date(log.timestamp).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                        No activity logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const logTh = { padding: '16px 20px', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' };
const logTd = { padding: '16px 20px', fontSize: '14px', color: '#1e293b' };

export default ActivityLogPage;
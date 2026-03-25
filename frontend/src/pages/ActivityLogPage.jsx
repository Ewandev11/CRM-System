import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const ActivityLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get('/api/v1/activity-logs/');
                setLogs(res.data.results || res.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchLogs();
    }, []);

    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                <h2>System Activity Logs</h2>
                {loading ? <p>Loading logs...</p> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#2c3e50', color: 'white' }}>
                            <tr>
                                <th style={{ padding: '10px' }}>User</th>
                                <th>Action</th>
                                <th>Model</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '10px' }}>{log.user_email}</td>
                                    <td><span style={{ fontWeight: 'bold' }}>{log.action}</span></td>
                                    <td>{log.model_name} (ID: {log.target})</td>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ActivityLogPage;
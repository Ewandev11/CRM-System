import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        company: ""
    });

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const [conRes, comRes] = await Promise.all([
                api.get('/contacts/'),
                api.get('/companies/')
            ]);

            setContacts(conRes.data.results || conRes.data || []);
            setCompanies(comRes.data.results || comRes.data || []);
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Failed to load data. Please refresh.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.company) {
            setError("You must select a company first.");
            return;
        }

        try {
            const payload = { 
                ...formData, 
                company: Number(formData.company),
                role: formData.role || ""
            };
            
            await api.post('/contacts/', payload);
            
            setFormData({ first_name: "", last_name: "", email: "", phone: "", company: "", role: "" });
            fetchData(); // Refresh contacts
        } catch (err) {
            // Improved Error Handling
            console.error("Full error:", err.response);
            
            let msg = "Submission failed";
            if (err.response?.data) {
                const data = err.response.data;
                // Check for specific field errors
                if (data.email) msg = Array.isArray(data.email) ? data.email[0] : data.email;
                else if (data.company) msg = Array.isArray(data.company) ? data.company[0] : data.company;
                else if (data.phone) msg = Array.isArray(data.phone) ? data.phone[0] : data.phone;
                else if (data.non_field_errors) msg = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
                else if (data.detail) msg = data.detail;
            }
            
            setError(msg);
        }
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto' }}>
                {error && <div style={errorStyle}>{error}</div>}

                <div style={formContainerStyle}>
                    <h3 style={{ marginTop: 0, fontSize: '16px', color: '#475569' }}>Add New Contact</h3>
                    <form onSubmit={handleSubmit} style={formGridStyle}>
                        <input
                            style={inputStyle}
                            placeholder="First Name"
                            required
                            value={formData.first_name}
                            onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                        />
                        <input
                            style={inputStyle}
                            placeholder="Last Name"
                            value={formData.last_name}
                            onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                        />
                        <input
                            style={inputStyle}
                            type="email"
                            placeholder="Work Email"
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                        <input
                            style={inputStyle}
                            placeholder="Phone (8-15 digits)"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <select
                            style={inputStyle}
                            required
                            value={formData.company}
                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                        >
                            <option value="">Assign to Company</option>
                            {Array.isArray(companies) && companies.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>

                        <button type="submit" style={addBtnStyle}>Register Contact</button>
                    </form>
                </div>

                <div style={tableCardStyle}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr style={{ borderBottom: '2px solid #edf2f7' }}>
                                <th style={thStyle}>Full Name</th>
                                <th style={thStyle}>Email Address</th>
                                <th style={thStyle}>Associated Company</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', padding: '40px' }}>Loading...</td>
                                </tr>
                            ) : contacts.length > 0 ? (
                                contacts.map(c => (
                                    <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={tdStyle}><strong>{c.first_name} {c.last_name}</strong></td>
                                        <td style={tdStyle}>{c.email}</td>
                                        <td style={tdStyle}>
                                            <span style={companyBadgeStyle}>
                                                {c.company_name || (c.company ? c.company.name : '—')}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                        No contacts found.
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

const formContainerStyle = { background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
const formGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' };
const inputStyle = { padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', width: '100%', boxSizing: 'border-box' };
const addBtnStyle = { padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' };
const errorStyle = { background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #fecaca' };
const tableCardStyle = { background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #e2e8f0' };
const thStyle = { padding: '16px 20px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' };
const tdStyle = { padding: '16px 20px', fontSize: '14px', color: '#334155', textAlign: 'left' };
const companyBadgeStyle = { background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', color: '#475569', fontWeight: '500' };

export default Contacts;